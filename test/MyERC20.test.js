const MyERC20 = artifacts.require("MyERC20");

contract("MyERC20", accounts => {
    let myToken;

    before(async () => {
        myToken = await MyERC20.new();
    });

    it("has correct name", async () => {
        const name = await myToken.name();
        assert.equal(name, "MyToken");
    });

    it("has correct symbol", async () => {
        const symbol = await myToken.symbol();
        assert.equal(symbol, "MTK");
    });

    it("can mint tokens", async () => {
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 100;
        const balanceBefore = await myToken.balanceOf(to);
        await myToken.mint(to, amount, { from: owner });
        const balanceAfter = await myToken.balanceOf(to);

        assert.equal(balanceAfter - balanceBefore, amount);
    });

    it("can burn tokens", async () => {
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 100;

        await myToken.mint(to, amount, { from: owner });
        const balanceBefore = await myToken.balanceOf(to);
        await myToken.burn(amount, { from: to });
        const balanceAfter = await myToken.balanceOf(to);

        assert.equal(balanceBefore - balanceAfter, amount);
    });

    it("can be paused and unpaused by owner", async () => {
        const owner = accounts[0];

        await myToken.pause({ from: owner });
        assert.equal(await myToken.paused(), true);

        await myToken.unpause({ from: owner });
        assert.equal(await myToken.paused(), false);
    });

    it("cannot transfer tokens while paused", async () => {
        const owner = accounts[0];
        const to = accounts[1];
        const amount = 100;

        await myToken.mint(owner, amount, { from: owner });
        await myToken.pause({ from: owner });

        try {
            await myToken.transfer(to, amount, { from: owner });
            assert.fail("Transfer should have failed");
        } catch (error) {
            assert.include(error.message, "Pausable: paused");
        }
    });
});
