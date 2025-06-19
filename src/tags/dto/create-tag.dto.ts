import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
} 


// id: 299422e2-4747-4b35-b68e-2b918477fc31 name: gelado
// id: daca3c66-3687-4283-8bae-bd5ccb662cca name: tradicional
// id: 94bfd805-2cbc-4944-aeb4-daf0c33d8473 name: expresso