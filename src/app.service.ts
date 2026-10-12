import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export class Productos {
  constructor(
    public nombre: string,
    public precio: number,
    public id: number,
    public descripcion: string,
  ) {}

  mostrarInformacion(): string {
    return `Producto: ${this.nombre}, precio: ${this.precio}, id: ${this.id}, descripción: ${this.descripcion}`;
  }

  actualizarPrecio(nuevoPrecio: number): void {
    this.precio = nuevoPrecio;
  }
}

export type ProductoDatos = Omit<Productos, 'id'>;

@Injectable()
export class AppService {
  private readonly productos: Productos[] = [];
  private siguienteId = 1;

  getHello(): string {
    return 'Hello World!';
  }

  obtenerProductos(): Productos[] {
    return this.productos;
  }

  obtenerProducto(id: number): Productos {
    const producto = this.productos.find((item) => item.id === id);
    if (!producto) {
      throw new NotFoundException(`No existe un producto con id ${id}`);
    }
    return producto;
  }

  crearProducto(datos: ProductoDatos): Productos {
    this.validarDatos(datos);
    const producto = new Productos(
      datos.nombre,
      datos.precio,
      this.siguienteId++,
      datos.descripcion,
    );
    this.productos.push(producto);
    return producto;
  }

  actualizarProducto(
    id: number,
    datos: Partial<ProductoDatos>,
  ): Productos {
    const producto = this.obtenerProducto(id);
    this.validarDatosParciales(datos);
    Object.assign(producto, datos);
    return producto;
  }

  eliminarProducto(id: number): Productos {
    const indice = this.productos.findIndex((item) => item.id === id);
    if (indice === -1) {
      throw new NotFoundException(`No existe un producto con id ${id}`);
    }
    return this.productos.splice(indice, 1)[0];
  }

  private validarDatos(datos: ProductoDatos): void {
    if (
      !datos ||
      typeof datos.nombre !== 'string' ||
      typeof datos.descripcion !== 'string' ||
      typeof datos.precio !== 'number' ||
      !Number.isFinite(datos.precio)
    ) {
      throw new BadRequestException(
        'Se requieren nombre y descripción como texto, y precio como número',
      );
    }
  }

  private validarDatosParciales(datos: Partial<ProductoDatos>): void {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('El cuerpo debe ser un objeto JSON');
    }
    if (
      ('nombre' in datos && typeof datos.nombre !== 'string') ||
      ('descripcion' in datos && typeof datos.descripcion !== 'string') ||
      ('precio' in datos &&
        (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio)))
    ) {
      throw new BadRequestException(
        'Nombre y descripción deben ser texto; precio debe ser un número',
      );
    }
  }
}
