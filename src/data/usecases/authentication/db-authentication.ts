import { Authentication, AuthenticationModel } from "../../../domain/use-cases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { HashComparer } from "../../protocols/cryptography/hash-compare";
import { Encrypter } from "../../protocols/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "../../protocols/db/update-access-token-repository";

export class DbAuthentication implements Authentication {
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
    private readonly hashCompare: HashComparer;
    private readonly Encrypter: Encrypter
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

    constructor(loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashComparer, Encrypter: Encrypter, updateAccessTokenRepository: UpdateAccessTokenRepository) {
        this.Encrypter = Encrypter;
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashCompare = hashCompare;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }
    async auth (authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
        if (account) {
            const isValid = await this.hashCompare.compare(authentication.password, account.password);
            if (isValid) {
                const accessToken = await this.Encrypter.encrypt(account.id)
                await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
                return accessToken;
            }
        }
        return null
    }
}