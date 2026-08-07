import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProductModel as PrismaProduct } from '../generated/prisma/models/Product';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateProductInput): Promise<Product> {
    const product = await this.prisma.product.create({
      data: input,
    });

    return this.mapProduct(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products.map((product) => this.mapProduct(product));
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.mapProduct(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    await this.findOne(id);

    const product = await this.prisma.product.update({
      where: { id },
      data: input,
    });

    return this.mapProduct(product);
  }

  async remove(id: string): Promise<Product> {
    await this.findOne(id);

    const product = await this.prisma.product.delete({
      where: { id },
    });

    return this.mapProduct(product);
  }

  private mapProduct(product: PrismaProduct): Product {
    return {
      ...product,
      price: product.price.toNumber(),
    };
  }
}
