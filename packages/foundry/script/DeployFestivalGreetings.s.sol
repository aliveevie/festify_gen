//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/Festify.sol";

/**
 * @title DeployFestivalGreetings
 * @dev Script to deploy the FestivalGreetings contract
 */
contract DeployFestivalGreetings is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        FestivalGreetings festivalGreetings = new FestivalGreetings();
        deployments.push(Deployment("FestivalGreetings", address(festivalGreetings)));
    }
} 