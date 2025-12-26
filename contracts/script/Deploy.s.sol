// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TransparentTreasury.sol";

contract DeployTreasury is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address agent = vm.envAddress("AGENT_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);

        // Daily limit of 1000 tokens (assuming 18 decimals)
        uint256 initialLimit = 1000 * 10**18;
        
        TransparentTreasury treasury = new TransparentTreasury(agent, initialLimit);
        
        console.log("Treasury deployed at:", address(treasury));

        vm.stopBroadcast();
    }
}
