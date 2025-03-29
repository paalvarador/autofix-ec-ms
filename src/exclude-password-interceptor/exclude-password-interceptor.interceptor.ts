import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((user) => omit(user, ['password']));
        }
        return omit(data, ['password']);
      }),
    );
  }
}

function omit<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
): Partial<T> {
  const newObj = { ...obj };
  keys.forEach((key) => delete newObj[key]);
  return newObj;
}
