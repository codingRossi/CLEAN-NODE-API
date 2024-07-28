import { Express, Router } from "express"
import fg from 'fast-glob'

export default (app: Express): void => {
    console.log("called")
    const router = Router()
    app.use('/api', router)
    fg.sync('**/src/main/routes/**routes.ts').map(async file => {
        console.log(file)
       return (await import(`../../../${file}`)).default(router)
    })
}
