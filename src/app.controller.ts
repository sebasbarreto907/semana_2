import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AppService, Productos } from './app.service';
import type { ProductoDatos } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('productos')
  obtenerProductos(): Productos[] {
    return this.appService.obtenerProductos();
  }

  @Get('productos/:id')
  obtenerProducto(@Param('id', ParseIntPipe) id: number): Productos {
    return this.appService.obtenerProducto(id);
  }

  @Post('productos')
  crearProducto(@Body() datos: ProductoDatos): Productos {
    return this.appService.crearProducto(datos);
  }

  @Patch('productos/:id')
  actualizarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<ProductoDatos>,
  ): Productos {
    return this.appService.actualizarProducto(id, datos);
  }

  @Delete('productos/:id')
  eliminarProducto(@Param('id', ParseIntPipe) id: number): Productos {
    return this.appService.eliminarProducto(id);
  }
}
