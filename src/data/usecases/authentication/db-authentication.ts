import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/cryptography/hash-compare";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashCompare: HashComparer;
    tokenGenerator: TokenGenerator
    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashComparer, tokenGenerator: TokenGenerator) {
        this.tokenGenerator = tokenGenerator;
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashCompare = hashCompare
    }
    async auth (authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                return accessToken;
            }
        }
        return null
    }
}