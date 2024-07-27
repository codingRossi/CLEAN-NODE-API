import { MongoClient } from "mongodb"

export const MongoHelper = {
    client: null as MongoClient,
    async connect (url: string): Promise<void> {
        this.client = await MongoClient.connect(global.__MONGO_URI__)
    },

    async disconnect (): Promise<void> {
        await this.client.close()
    } 
}