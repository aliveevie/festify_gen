// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/Festify.sol";

contract FestivalGreetingsTest is Test {
    FestivalGreetings public festivalGreetings;

    function setUp() public {
        festivalGreetings = new FestivalGreetings();
    }

    function testInitialState() public view {
        // Add your test cases here
    }
}
