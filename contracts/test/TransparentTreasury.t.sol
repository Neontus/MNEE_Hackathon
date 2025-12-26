// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/TransparentTreasury.sol";

contract MockToken is IERC20 {
    mapping(address => uint256) public balances;
    
    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }
    
    function transfer(address to, uint256 amount) external override returns (bool) {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return balances[account];
    }
}

contract TreasuryTest is Test {
    TransparentTreasury treasury;
    MockToken token;
    address owner = address(1);
    address agent = address(2);
    address recipient = address(3);

    function setUp() public {
        vm.startPrank(owner);
        token = new MockToken();
        treasury = new TransparentTreasury(agent, 1000 * 10**18);
        vm.stopPrank();
    }

    function testDeposit() public {
        token.mint(address(this), 100 * 10**18);
        // Simulate transferFrom approval logic if implicit or just mock it
        // Direct mint to treasury for simplicity of test
        token.mint(address(treasury), 50 * 10**18);
        
        assertEq(token.balanceOf(address(treasury)), 50 * 10**18);
    }
    
    function testAgentPay() public {
        token.mint(address(treasury), 1000 * 10**18);
        
        vm.startPrank(agent);
        treasury.pay(address(token), recipient, 100 * 10**18, "Services");
        vm.stopPrank();
        
        assertEq(token.balanceOf(recipient), 100 * 10**18);
        assertEq(treasury.spentToday(), 100 * 10**18);
    }
    
    function testBudgetExceeded() public {
        token.mint(address(treasury), 2000 * 10**18);
        
        vm.startPrank(agent);
        // Daily limit is 1000. Try 1001.
        vm.expectRevert("Daily limit exceeded");
        treasury.pay(address(token), recipient, 1001 * 10**18, "Services");
        vm.stopPrank();
    }
}
