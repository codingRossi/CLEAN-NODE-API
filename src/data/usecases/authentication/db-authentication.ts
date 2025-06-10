import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/cryptography/hash-compare";
import { TokenGenerator } from "../../protocols/cryptography/token-generator";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashCompare: HashComparer;
    private readonly tokenGenerator: TokenGenerator
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashComparer, tokenGenerator: TokenGenerator, updateAccessTokenRepository: UpdateAccessTokenRepository) {
        this.tokenGenerator = tokenGenerator;
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashCompare = hashCompare;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }
    async auth (authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.tokenGenerator.generate(account.id)
                await this.updateAccessTokenRepository.update(account.id, accessToken);
                return accessToken;
            }
        }
        return null
    }
}