import mongoose from "mongoose"

const OrderItemsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }


})


const OrderSchema = mongoose.Schema({
    orderPrice: {
        type: String,
        required: true
    },

    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },

    orderItems: {
        type:[OrderItemsSchema]
    }, 
    address: {
        type: String,
        required: true
    },
    status:{
        type:String,
        enum:["PENDING","CANCEL","DELIVERED"],
        default:"PENDING"
    }
}, {
    timestamps: true
})





export const Order = mongoose.model("Order", OrderSchema)