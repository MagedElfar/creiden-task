import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User, UserRole } from "src/users/user.entity";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {


        const req = context.switchToHttp().getRequest();
        const user: User = req.user;
        const params = req.params;

        if (req.method === "POST" && req.user.role !== UserRole.ADMIN) return false;

        console.log(req.body)

        if (req.method === "PUT" && req.user.role !== UserRole.ADMIN && req?.body?.role) return false;

        if (user.role === UserRole.ADMIN) {
            return true;
        }

        if (user._id.toString() === params.id || !Object.keys(params).length) {
            return true;
        }

        return false;

    }
}