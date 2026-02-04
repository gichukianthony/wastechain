import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { verifyPresentation } from 'did-jwt-vc';
import { didResolver } from './did-resolver.config';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredential } from '../users/entities/user-credential.entity';

interface ChallengeStoreEntry {
  did: string;
  nonce: string;
  expiresAt: number;
}

@Injectable()
export class DidAuthService {
  private readonly challengeStore: Map<string, ChallengeStoreEntry> = new Map();

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(UserCredential)
    private readonly credentialRepo: Repository<UserCredential>,
  ) { }

  async issueChallenge(did?: string) {
    const nonce = uuid();
    // We use the nonce as the challengeId for simplicity, or we could generate a separate ID.
    // The controller expects 'challengeId' in the response if it maps to what verifyAndLogin expects.
    // But here we return { nonce }. Let's align with the controller.
    // Controller: return this.didAuthService.issueChallenge(did);
    // Controller expects: { challengeId, nonce, did } ideally, or just what the client needs.
    // The duplicate code returned: { challengeId, nonce, did: entry.did }

    // Let's stick to the cleaner implementation but ensure it matches expectations.
    this.challengeStore.set(nonce, {
      did: did ?? '',
      nonce,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // Return challengeId as nonce for compatibility if needed, or just nonce.
    return { challengeId: nonce, nonce, did };
  }

  private async consumeChallenge(challengeId: string): Promise<ChallengeStoreEntry> {
    const entry = this.challengeStore.get(challengeId);
    if (!entry || entry.expiresAt < Date.now()) {
      throw new UnauthorizedException('Challenge expired or invalid');
    }
    this.challengeStore.delete(challengeId);
    return entry;
  }

  async verifyAndLogin(params: { did?: string; jwt: string; challengeId: string }) {
    const entry = await this.consumeChallenge(params.challengeId);
    if (entry.did && params.did && entry.did !== params.did) {
      // If DID was provided during challenge, it must match.
      throw new UnauthorizedException('DID mismatch');
    }

    // Verify the DID presentation/jwt
    const result = await verifyPresentation(params.jwt, didResolver, {
      challenge: entry.nonce,
      audience: 'wastechain-api', // Ensure this matches what the client signs
    });

    if (!result.verifiablePresentation) {
      throw new UnauthorizedException('Invalid presentation');
    }

    const did = result.verifiablePresentation.holder || params.did;
    if (!did) {
      throw new UnauthorizedException('DID not found in presentation or request');
    }

    // Link the DID to user
    let user = await this.usersService.findByCredential('DID', did);
    if (!user) {
      user = await this.usersService.createUserForDid(did);

      // Save credential
      await this.credentialRepo.save(
        this.credentialRepo.create({
          user,
          type: 'DID',
          identifier: did,
          metadata: result.verifiablePresentation as any, // Cast to any if type mismatch
        }),
      );
    }

    // Return what the controller expects. 
    // The duplicate code returned: { userId, auth, did }
    // We should probably return the user or a token.
    // For now, let's return the user object as the controller just returns the result.
    return user;
  }
}


