import { adaptMiddlware } from "../adapters/express-middlware-adapter";
import { makeAuthMiddlware } from "../factories/middlwares/auth-middlware";

export const auth = adaptMiddlware(makeAuthMiddlware())
