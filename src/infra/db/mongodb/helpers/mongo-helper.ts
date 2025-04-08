import { Collection, MongoClient } from "mongodb"
import { AccountModel } from "../../../../domain/models/account"

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  },

  async disconnect(): Promise<void> {
    await this.client.close()
  },

  getColletion(name: string): Collection {
    return this.client.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return {
      id: _id.id.toString(),
      email: collectionWithoutId.email as string,
      name: collectionWithoutId.name as string,
      password: collectionWithoutId.password as string
    }
  }
}