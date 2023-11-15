const { expect } = require("chai")

describe("MyToken", function () {
    let owner, alice, bob, carla, myToken
    let tokenID = 1
    log = console.log

    before(async function () {
        ;[owner, alice, bob, carla] = await ethers.getSigners()
        myToken = await (await ethers.getContractFactory("MyToken")).deploy(owner.address)
    })

    async function batchMintLogGas(to, amount, log) {
        for (let i = 1; i <= amount; i++) {
            const receipt = await myToken.safeMint(to, tokenID)
            const tx = await receipt.wait()
            if (log) console.log(`\tGas used to mint token ${tokenID} was:`, String(tx.gasUsed))
            tokenID++
        }
    }

    async function getAllTokensFromAddress(address) {
        const amount = await myToken.balanceOf(address)
        let tokens = []
        for (let i = 1; i <= amount; i++) tokens.push(String(await myToken.tokenOfOwnerByIndex(address, i - 1)))
        return tokens
    }

    async function getAllTokens() {
        const amount = await myToken.totalSupply()
        let tokens = []
        for (let i = 0; i < amount; i++) tokens.push(String(await myToken.tokenByIndex(i)))
        return tokens
    }

    describe("Minting, burning and populating data structures", function () {
        it("Should populate data structures as expected", async function () {
            await batchMintLogGas(alice.address, 3, true)
            await batchMintLogGas(bob.address, 3, true)
            await batchMintLogGas(carla.address, 3, true)
            log("")
            log("Alice's tokens are", await getAllTokensFromAddress(alice.address))
            log("Bob's tokens are", await getAllTokensFromAddress(bob.address))
            log("Carla's tokens are", await getAllTokensFromAddress(carla.address))
            log("")
            log("TOTAL SUPPLY OF TOKENS IS: ", (await myToken.totalSupply()).toString(), await getAllTokens())
            log("")
            log("**********************************************")
            log("Alice transfers her token ID 1 to Carla")
            log("**********************************************")
            log("")
            await myToken.connect(alice).transferFrom(alice.address, carla.address, 1)
            log("Alice's tokens after transferring are", await getAllTokensFromAddress(alice.address))
            log("Carla's tokens after transferring are", await getAllTokensFromAddress(carla.address))
            log("")
            log("ARRANGEMENT OF TOTAL SUPPLY OF TOKENS AFTER TRANSFERRING DOES NOT CHANGE: ", await getAllTokens())
            log("")
            log("**********************************************")
            log("Bob burns token ID 4")
            log("**********************************************")
            log("")
            await myToken.connect(bob).burn(4)
            log("Bob's tokens after burning", await getAllTokensFromAddress(bob.address))
            log("ARRANGEMENT OF TOTAL SUPPLY OF TOKENS AFTER BURNING DOES CHANGE: ", await getAllTokens())

            expect(await myToken.balanceOf(alice.address)).to.equal(2)
            expect(await myToken.balanceOf(bob.address)).to.equal(2)
            expect(await myToken.balanceOf(carla.address)).to.equal(4)
            expect(await myToken.totalSupply()).to.equal(8)
        })
    })
})
