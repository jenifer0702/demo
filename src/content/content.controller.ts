import {Controller,Get,Req,UseGuards,NotFoundException,} from '@nestjs/common';
  import { ContentService } from './content.service';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  import { RolesGuard } from '../guards/roles.guard';
  import { Roles } from '../guards/roles.decorator';
  
  @Controller('content')
  export class HospitalInfoController {
    constructor(private readonly contentService: ContentService) {}
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('doctor', 'patient')
    @Get()
    async getHospitalContent(@Req() req) {
  
      const { hospitalId } = req.user;
    
  
      const content = await this.contentService.getHospitalContent(hospitalId);
      if (!content) {
        
        throw new NotFoundException('Hospital content not found.');
      }
  
      
      return content;
    }
  }
  