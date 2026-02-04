import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { DidAuthService } from './did-auth.service';

@ApiTags('auth')
@Controller('auth/did')
export class DidAuthController {
  constructor(private readonly didAuthService: DidAuthService) {}

  @Post('challenge')
  @ApiOperation({ summary: 'Request DID authentication challenge' })
  @ApiResponse({ status: 200, description: 'Challenge issued successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        did: {
          type: 'string',
          description: 'Decentralized Identifier',
          example: 'did:example:123456789abcdefghi',
        },
      },
    },
    required: false,
  })
  async getChallenge(@Body('did') did?: string) {
    return this.didAuthService.issueChallenge(did);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with DID and signed JWT' })
  @ApiResponse({ status: 200, description: 'DID login successful, returns JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid DID or JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        did: {
          type: 'string',
          description: 'Decentralized Identifier',
          example: 'did:example:123456789abcdefghi',
        },
        jwt: {
          type: 'string',
          description: 'Signed JWT token',
          example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        challengeId: {
          type: 'string',
          description: 'Challenge ID from challenge endpoint',
          example: '50031695-a58c-413d-82ec-7bca9ed56ccd',
        },
      },
      required: ['jwt', 'challengeId'],
    },
  })
  async login(
    @Body()
    body: {
      did?: string;
      jwt: string;
      challengeId: string;
    },
  ) {
    return this.didAuthService.verifyAndLogin({
      did: body.did,
      jwt: body.jwt,
      challengeId: body.challengeId,
    });
  }
}

