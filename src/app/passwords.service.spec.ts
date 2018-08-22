import { TestBed, inject } from '@angular/core/testing';

import { PasswordsService } from './passwords.service';

describe('PasswordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordsService]
    });
  });

  it('should be created', inject([PasswordsService], (service: PasswordsService) => {
    expect(service).toBeTruthy();
  }));
});
