require('gym-commons/polyfills/string')
require('gym-commons/polyfills/number')
const { mongoose, models: { User, Contract, Product, Price, AccountBalance } } = require('gym-data')
const { ObjectId } = mongoose
const moment = require('moment')

const { errors: { UnexistenceError } } = require('gym-commons')

const addGuarantee = require('./add-guarantee')

module.exports = (userId, productId, priceId, side, quantity) => {
    String.validate.notVoid(priceId)
    String.validate.notVoid(userId)
    String.validate.notVoid(productId)
    String.validate.notVoid(side)
    Number.validate.integer(quantity)

    return (async () => {
        const user = await User.findById(userId)

        if (!user) throw new UnexistenceError(`user with id ${userId} is not exist`)

        const { card: { number, holder, expirationDate, cvv } } = user

        if (!number && !holder && !expirationDate && !cvv) throw new UnexistenceError('user does not have a card added')

        const product = await Product.findById(productId)

        if (!product) throw new UnexistenceError(`product with id ${productId} is not exist`)

        const { price } = await Price.findById(priceId)

        const balances = await AccountBalance.find({ user: ObjectId(userId) }).sort({ date: -1 })

        let guarantee = 0
        let profitAndLoss = 0

        if (balances.length) {
            const [balance] = balances

            profitAndLoss += balance.profitAndLoss
        }

        if (product.productType === 'option') {
            const { contractSize: _contractSize, type: { strike } } = product

            if (side === 'Buy') {
                profitAndLoss -= (quantity * _contractSize * price).toFixed(2) * 1

            } else {
                profitAndLoss += (quantity * _contractSize * price).toFixed(2) * 1
            }

        }

        let contract = await Contract.findOne({ product: ObjectId(productId), isValid: true })

        if (!contract) {
            contract = await Contract.create({ user: ObjectId(userId), product: ObjectId(productId), isValid: true })
            contract.trades.push({ price: ObjectId(priceId), type: side, quantity })
        } else {
            const index = contract.trades.map(item => item.price.toString()).indexOf(priceId)
            if (index === -1)
                contract.trades.push({ price: ObjectId(priceId), type: side, quantity })
            else {
                let { type, quantity: _quantity } = contract.trades[index]
                if (type === side) _quantity += quantity
                else {
                    if (_quantity < quantity) {
                        _quantity = (_quantity - quantity) * (-1)
                        type = side
                    } else if (_quantity > quantity) _quantity -= quantity
                    else {
                        await Contract.findByIdAndUpdate(contract._id, { isValid: false })
                        return
                    }
                }
                contract.trades.splice(index, 1)
                contract.trades.push({ price: ObjectId(priceId), type, quantity: _quantity })
            }
        }

        await contract.save()

        guarantee = await addGuarantee(userId)

        await AccountBalance.create({ user: userId, date: new Date(), guarantee, profitAndLoss })
    })()
}