import {
  INestApplication, ValidationPipe
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto, SignupDto } from 'src/auth/dto';
import { ChangePasswordDto, UpdatePasswordDto } from 'src/user/dto';

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }))

    await app.init()
    await app.listen(3333)

    prisma = app.get(PrismaService)
    await prisma.cleanDb()

    pactum.request.setBaseUrl('http://localhost:3333')
  })

  afterAll(() => {
    app.close()
  })

  describe('Auth', () => { 

    const dto: SignupDto = {
      "firstname": "Ahmed",
      "lastname": "Olanrewaju",
      "email": "olanrewajuahmed095@yahoo.com",
      "phone": "8093570289",
      "country": "Nigeria",
      "countryCode": "NG",
      "countryDialCode": "234",
      "password": "password",
      "referrer": "" //optional
    }
    
    describe('Signup', () => {
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      })

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })

      it('should throw if user exist', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403)
      })

      it('should throw if referral code is invalid', () => {
        dto.referrer = '08093570289x'
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403)
      })

      it('should create if referral code is valid', () => {
        // new user
        dto.firstname = 'Kabir'
        dto.lastname = 'Olanrewaju'
        dto.email = 'abdulkabir@yahoo.com'
        dto.phone = '+2349031461447'
        dto.referrer = '08093570289' //existing user referral
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })

      it('should throw if email is empty', () => {
        dto.email = ''
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400)
      })
    })

    describe('Signin', () => {
      it('should throw if wrong email', () => {
        const dto: AuthDto = {
          "username": "olanrewajuahmed0958@yahoo.com",
          "password": "password",
        }

        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(403)
      })

      it('should throw if wrong password', () => {
        const dto: AuthDto = {
          "username": "olanrewajuahmed095@yahoo.com",
          "password": "passwordd",
        }

        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(403)
      })

      it('should signin', () => {
        const dto: AuthDto = {
          "username": "olanrewajuahmed095@yahoo.com",
          "password": "password",
        }

        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token')
      })
    })
  })

  describe('User', () => {

    describe('Get user', () => {
      it('should get current user', ()=> {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })

      it('should throw if request is not authorised', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(401)
      })
    })

    describe('Update Password', () => {
      const dto: UpdatePasswordDto = {
        password: 'password@12345',
        confirmedPassword: 'password@12345',
      }

      it('should update password', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })

      it('should throw if password do not match', () => {
        dto.confirmedPassword = 'password'
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(403)
      })

      it('should throw if request is not authorised', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(dto)
          .expectStatus(401)
      })
    })

    describe('Change Password', () => {
      const dto: ChangePasswordDto = {
        oldpassword: 'password',
        password: 'password@12345',
        confirmedPassword: 'password@12345',
      }

      it('should change password', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })

      it('should throw if old password is wrong', () => {
        dto.oldpassword = 'oldpassword'
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(403)
      })

      it('should throw if new password do not match', () => {
        dto.confirmedPassword = 'password'
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(403)
      })

      it('should throw if request is not authorised', () => {
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .expectStatus(401)
      })
    })

    describe('Update BasicData', () => {
      const dto: ChangePasswordDto = {
        oldpassword: 'password',
        password: 'password@12345',
        confirmedPassword: 'password@12345',
      }

      it('should change password', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })

      it('should throw if old password is wrong', () => {
        dto.oldpassword = 'oldpassword'
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(403)
      })

      it('should throw if new password do not match', () => {
        dto.confirmedPassword = 'password'
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(403)
      })

      it('should throw if request is not authorised', () => {
        return pactum
          .spec()
          .patch('/users/password/change')
          .withBody(dto)
          .expectStatus(401)
      })
    })
  })

})