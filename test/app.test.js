const request = require('supertest')
const { expect } = require('chai')
const app = require('../app')

// ---------------------------------------------------------------
// TIP: Use AI to help you generate test cases!
// Paste your app.js into your AI tool of choice and ask it to
// write Mocha + Chai + Supertest tests for each route.
// Review what it generates, make sure you understand each test,
// and adjust as needed before running them.
// ---------------------------------------------------------------

// Minimum requirement: at least 6 tests total across all routes.

// ---------------------------------------------------------------
// GET /
// ---------------------------------------------------------------
// Ideas:
//   - Should return status 200
//   - Response body should have a "message" property
//   - Message should include the hotel name

describe('GET /', () => {
  it('should return status 200', () => {
    return request(app).get('/').expect(200)
  })

  it('should have a message property', () => {
    return request(app).get('/').then(res => {
      expect(res.body).to.have.property('message')
    })
  })

  it('message should include hotel name', () => {
    return request(app).get('/').then(res => {
      expect(res.body.message).to.include('Grand Azure Hotel')
    })
  })
})

// ---------------------------------------------------------------
// GET /rooms
// ---------------------------------------------------------------
// Ideas:
//   - Should return status 200
//   - Should return an array
//   - Should return the correct number of rooms
//   - Each room should have: id, name, type, pricePerNight, available
//   - ?type=suite should return only suite rooms
//   - ?type=deluxe should return only deluxe rooms
//   - ?type=standard should return only standard rooms
//   - Filtering by a type that doesn't exist should return an empty array

describe('GET /rooms', () => {
  it('should return status 200', () => {
    return request(app).get('/rooms').expect(200)
  })

  it('should return an array', () => {
    return request(app).get('/rooms').then(res => {
      expect(res.body).to.be.an('array')
    })
  })

  it('should return the correct number of rooms', () => {
    return request(app).get('/rooms').then(res => {
      expect(res.body).to.have.lengthOf(7)
    })
  })

  it('each room should have required properties', () => {
    return request(app).get('/rooms').then(res => {
      res.body.forEach(room => {
        expect(room).to.have.all.keys('id', 'name', 'type', 'pricePerNight', 'available')
      })
    })
  })

  it('?type=suite should return only suite rooms', () => {
    return request(app).get('/rooms?type=suite').then(res => {
      expect(res.body).to.have.lengthOf(3)
      res.body.forEach(room => {
        expect(room.type).to.equal('suite')
      })
    })
  })

  it('?type=deluxe should return only deluxe rooms', () => {
    return request(app).get('/rooms?type=deluxe').then(res => {
      expect(res.body).to.have.lengthOf(2)
      res.body.forEach(room => {
        expect(room.type).to.equal('deluxe')
      })
    })
  })

  it('?type=standard should return only standard rooms', () => {
    return request(app).get('/rooms?type=standard').then(res => {
      expect(res.body).to.have.lengthOf(2)
      res.body.forEach(room => {
        expect(room.type).to.equal('standard')
      })
    })
  })

  it('filtering by a type that doesn\'t exist should return an empty array', () => {
    return request(app).get('/rooms?type=nonexistent').then(res => {
      expect(res.body).to.be.an('array').and.have.lengthOf(0)
    })
  })
})

// ---------------------------------------------------------------
// GET /rooms/:id
// ---------------------------------------------------------------
// Ideas:
//   - Should return status 200 for a valid id
//   - Should return the correct room name for a given id
//   - Should return status 404 for an id that doesn't exist
//   - 404 response should include an "error" property

describe('GET /rooms/:id', () => {
  it('should return status 200 for a valid id', () => {
    return request(app).get('/rooms/1').expect(200)
  })

  it('should return the correct room name for a given id', () => {
    return request(app).get('/rooms/1').then(res => {
      expect(res.body.name).to.equal('Standard Queen')
    })
  })

  it('should return status 404 for an id that doesn\'t exist', () => {
    return request(app).get('/rooms/99').expect(404)
  })

  it('404 response should include an "error" property', () => {
    return request(app).get('/rooms/99').then(res => {
      expect(res.body).to.have.property('error')
    })
  })
})

// ---------------------------------------------------------------
// GET /available
// ---------------------------------------------------------------
// Ideas:
//   - Should return status 200
//   - Should return an array
//   - Every room in the response should have available === true
//   - Should not include any unavailable rooms

describe('GET /available', () => {
  it('should return status 200', () => {
    return request(app).get('/available').expect(200)
  })

  it('should return an array', () => {
    return request(app).get('/available').then(res => {
      expect(res.body).to.be.an('array')
    })
  })

  it('every room in the response should have available === true', () => {
    return request(app).get('/available').then(res => {
      res.body.forEach(room => {
        expect(room.available).to.be.true
      })
    })
  })

  it('should not include any unavailable rooms', () => {
    return request(app).get('/available').then(res => {
      const ids = res.body.map(r => r.id)
      expect(ids).to.not.include(2)
      expect(ids).to.not.include(5)
    })
  })
})
