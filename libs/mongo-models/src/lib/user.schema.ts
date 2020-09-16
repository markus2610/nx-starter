import { Document, Schema } from 'mongoose'
import { nid } from '@nx-starter/util'

const userSchema = new Schema(
    {
        _id: { type: String, default: () => nid('u') },
        password: {
            type: String,
            required: true,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['User', 'Admin', 'SuperAdmin'],
            default: 'User',
        },
        verifyToken: String,
        isActive: { type: Boolean, default: false },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        timestamps: true,
    },
)

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const UserSchema = userSchema
