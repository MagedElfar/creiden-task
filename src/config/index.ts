import { User } from './../users/user.entity';
import { TypeOrmModuleOptions } from "@nestjs/typeorm"


export default () => ({
    port: process.env.PORT,
    hostURL: "http://localhost:5000/",
    jwt: {
        secret: process.env.TOKEN_SECRET,
        accessTokenExpire: process.env.Access_Token_Expire,
        refreshTokenExpire: process.env.Refresh_Token_Expire
    },
    typeOrm: <TypeOrmModuleOptions>{
        type: 'mongodb',
        url: process.env.MONGODB_URL,
        authSource: 'admin',
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        database: process.env.MONGODB_DBNAME,
        entities: [User],
        synchronize: true,
    }
})