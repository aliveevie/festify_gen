// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "forge-std/console.sol";

/**
 * @title FestivalGreetings
 * @dev A contract for creating and sending festival greeting NFTs with SVG designs
 */

contract FestivalGreetings is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Simple counter for token IDs
    uint256 private _nextTokenId = 1;
    
    // Mapping from token ID to festival type
    mapping(uint256 => string) private _tokenFestivals;
    
    // Mapping from token ID to sender address
    mapping(uint256 => address) private _tokenSenders;
    
    // Mapping from token ID to message
    mapping(uint256 => string) private _tokenMessages;
    
    // Mapping from address to array of token IDs (sent)
    mapping(address => uint256[]) private _sentTokens;
    
    // Mapping from address to array of token IDs (received)
    mapping(address => uint256[]) private _receivedTokens;

    // Optional: Fee for minting a greeting card (set to 0 by default)
    uint256 public mintFee = 0;

    // Events
    event GreetingCardMinted(
        uint256 indexed tokenId,
        address indexed sender,
        address indexed recipient,
        string festival,
        string message,
        uint256 value
    );

    constructor() ERC721("Festival Greetings", "FGRT") Ownable(msg.sender) {
        console.log("Deploying Festival Greetings NFT Contract");
    }

    /**
     * @dev Generates SVG image for the greeting card
     */
    function generateSVG(string memory message, string memory festival) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">',
                '<rect width="500" height="500" fill="#f0f0f0"/>',
                '<text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="#333">',
                festival,
                '</text>',
                '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="18" fill="#666">',
                message,
                '</text>',
                '</svg>'
            )
        );
    }

    /**
     * @dev Creates metadata JSON for the token
     */
    function generateMetadata(
        string memory /* message */,
        string memory festival,
        string memory svg
    ) internal pure returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Festival Greeting",',
                        '"description": "A special festival greeting NFT",',
                        '"attributes": [{"trait_type": "Festival", "value": "',
                        festival,
                        '"}],',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '"}'
                    )
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @dev Creates a new greeting card NFT and sends it to the recipient
     * @param recipient Address of the recipient
     * @param message The greeting message
     * @param festival Type of festival (e.g., "christmas", "eid", "newyear", "sallah")
     */
    function mintGreetingCard(
        address recipient,
        string memory message,
        string memory festival
    ) public payable returns (uint256) {
        require(recipient != address(0), "Cannot mint to zero address");
        require(bytes(message).length > 0, "Message cannot be empty");
        require(bytes(festival).length > 0, "Festival type cannot be empty");
        
        // Check if the sender has paid the mint fee (if applicable)
        if (mintFee > 0) {
            require(msg.value >= mintFee, "Insufficient funds to mint greeting card");
        }

        uint256 newTokenId = _nextTokenId++; // Increment the token ID after using it

        // Generate SVG and metadata
        string memory svg = generateSVG(message, festival);
        string memory metadata = generateMetadata(message, festival, svg);

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadata);
        
        // Store additional information
        _tokenFestivals[newTokenId] = festival;
        _tokenSenders[newTokenId] = msg.sender;
        _tokenMessages[newTokenId] = message;
        
        // Update sender and recipient records
        _sentTokens[msg.sender].push(newTokenId);
        _receivedTokens[recipient].push(newTokenId);

        // Transfer any additional ETH to the recipient
        if (msg.value > mintFee) {
            (bool success, ) = recipient.call{value: msg.value - mintFee}("");
            require(success, "ETH transfer failed");
        }

        emit GreetingCardMinted(newTokenId, msg.sender, recipient, festival, message, msg.value);
        
        return newTokenId;
    }

    /**
     * @dev Returns the message for a given token ID
     */
    function getGreetingMessage(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Message query for nonexistent token");
        return _tokenMessages[tokenId];
    }

    /**
     * @dev Returns the festival type for a given token ID
     */
    function getGreetingFestival(uint256 tokenId) public view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Festival query for nonexistent token");
        return _tokenFestivals[tokenId];
    }

    /**
     * @dev Returns the sender address for a given token ID
     */
    function getGreetingSender(uint256 tokenId) public view returns (address) {
        require(_ownerOf(tokenId) != address(0), "Sender query for nonexistent token");
        return _tokenSenders[tokenId];
    }

    /**
     * @dev Returns all token IDs sent by an address
     */
    function getSentGreetings(address sender) public view returns (uint256[] memory) {
        return _sentTokens[sender];
    }

    /**
     * @dev Returns all token IDs received by an address
     */
    function getReceivedGreetings(address recipient) public view returns (uint256[] memory) {
        return _receivedTokens[recipient];
    }

    /**
     * @dev Sets the mint fee
     * @param newFee New fee amount in wei
     */
    function setMintFee(uint256 newFee) public onlyOwner {
        mintFee = newFee;
    }

    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Override functions to resolve conflicts between inherited contracts
     */
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
