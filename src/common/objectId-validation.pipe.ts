import { NotAcceptableException } from '@nestjs/common/exceptions';
import { Injectable, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<string> {
  transform(value: string): string {

    if (!ObjectId.isValid(value)) {
      throw new NotAcceptableException('Invalid ObjectId');
    }

    return value
  }
}