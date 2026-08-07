import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  createProduct(@Args('input') input: CreateProductInput): Promise<Product> {
    return this.productsService.create(input);
  }

  @Query(() => [Product], { name: 'products' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product, {
    name: 'product',
  })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(id, input);
  }

  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => ID }) id: string): Promise<Product> {
    return this.productsService.remove(id);
  }
}
