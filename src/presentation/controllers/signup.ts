export class SignUpController {
    handle (httpRequest: any): any {
            if (!httpRequest.body.email) { 
                return {
                statusCode: 400,
                body: new Error('Missing Param Error')
                }
            }

            if (!httpRequest.body.email) {
                return {
                statusCode: 400,
                body: new Error('Missing Param Error')
                }
            }
        }
    }