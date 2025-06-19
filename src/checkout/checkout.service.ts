import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(checkoutDto: CheckoutDto) {
    const { cartId, deliveryAddress, paymentMethod } = checkoutDto;

    // Obter o carrinho com itens e cálculos
    const cart = await this.cartService.getCart(cartId);

    // Criar o pedido
    

    // Formatar a resposta
    
  }
} 