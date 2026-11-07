import { HttpInterceptorFn } from '@angular/common/http';
import { mockHttpInterceptor } from '../../../mocks/_base/mock-http-interceptor';

export const appHttpInterceptors: HttpInterceptorFn[] = [mockHttpInterceptor];
