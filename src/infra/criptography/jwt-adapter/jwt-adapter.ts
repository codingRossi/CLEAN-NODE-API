import { Decrypter } from "../../../data/protocols/cryptography/decrypter";
import { Encrypter } from "../../../data/protocols/cryptography/encrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) { }
    async encrypt(value: string): Promise<string> {
        const accessToken = await jwt.sign({ id: value }, this.secret)
        return accessToken
    }

    async decrypt(token: string): Promise<string> {
        const value: any = await jwt.verify(token, this.secret)
        return value
    }
}