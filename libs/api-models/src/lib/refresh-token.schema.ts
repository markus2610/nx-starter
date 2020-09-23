import { nid } from '@nx-starter/shared-utils'
import { Schema } from 'mongoose'

const schema = new Schema(
    {
        _id: { type: String, default: () => nid('reftoken') },
        userId: { type: String, required: true },
        token: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

export const RefreshTokenSchema = schema
