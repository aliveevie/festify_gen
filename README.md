# Festify - Festival Greeting NFTs

Festify is a decentralized platform that enables users to create and send unique festival greeting NFTs with custom SVG designs. Built on Ethereum, it allows users to express their festive wishes through blockchain technology.

## Features

- Create and send festival greeting NFTs
- Custom SVG designs for each greeting
- Support for IPFS and on-chain SVG storage
- Track sent and received greetings
- Customizable greeting messages
- Festival type categorization
- Optional minting fee support

## Smart Contract Details

The main contract `FestivalGreetings` is an ERC721 token contract that implements the following key features:

- ERC721URIStorage for NFT metadata
- Ownable for access control
- Custom SVG generation
- Metadata management
- Greeting tracking system

## Technical Specifications

- Solidity Version: ^0.8.19
- OpenZeppelin Contracts Integration
- SVG-based NFT artwork
- Base64 encoding for metadata
- IPFS support for image storage

## Contract Functions

### Core Functions
- `mintGreetingCard`: Create and send a new festival greeting NFT
- `getGreetingMessage`: Retrieve the message of a specific greeting
- `getGreetingFestival`: Get the festival type of a greeting
- `getGreetingSender`: Find out who sent a greeting
- `getGreetingImage`: Access the image URI of a greeting
- `getSentGreetings`: View all greetings sent by an address
- `getReceivedGreetings`: View all greetings received by an address

### Admin Functions
- `setMintFee`: Configure the minting fee (owner only)
- `withdraw`: Withdraw contract balance (owner only)

## Development

### Prerequisites
- Node.js
- Foundry
- OpenZeppelin Contracts

### Setup
1. Clone the repository
2. Install dependencies
3. Configure your environment variables
4. Run tests using Foundry

## Testing

The project includes comprehensive test coverage using Foundry:
- Unit tests for core functionality
- Integration tests for contract interactions
- Fuzz testing for input validation

## License

MIT License

## Security

The contract implements standard security practices:
- Access control through OpenZeppelin's Ownable
- Input validation
- Secure withdrawal mechanism
- Protected admin functions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
