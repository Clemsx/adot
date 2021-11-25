import postPoi from '../controllers/posts';
import axios from 'axios';

describe('ControllerFunction', () => {
  it('should be an object', () => {
    expect(postPoi).toBeInstanceOf(Object);
  });

  it('should not be function', () => {
    expect(postPoi).not.toBeInstanceOf(Function);
  });

  it('should be an instance of function', () => {
    expect(postPoi.postPoi).toBeInstanceOf(Function);
  });

  it('should returns an object', async () => {
    const data = {
      coordinates: [
        {
          lat: 48.86,
          lon: 2.35,
          name: 'Chatelet',
        },
        {
          lat: 48.8759992,
          lon: 2.3481253,
          name: 'Arc de triomphe',
        },
      ],
    };

    const res = await axios.post('http://localhost:8000/poi', data);

	expect(res).not.toBeInstanceOf(Array);
	
	expect(Object.keys(res.data)).toEqual(['Chatelet', 'Arc de triomphe']);
	expect(res.data['Chatelet']).toHaveProperty('lat');
  });

  /*
	it('reverse a string - 0', () => {
		expect(reverseString('str')).toStrictEqual('rts')
	})
	it('reverse a string - 1', () => {
		expect(reverseString('strWithNumber0')).toStrictEqual('0rebmuNhtiWrts')
	})
	it('reverse a string - 2', () => {
		expect(reverseString('a')).toStrictEqual('a')
	})
	it('reverse a string - 3', () => {
		expect(reverseString(require('./0-reverseStringLongString.json')))
			.toStrictEqual(require('./0-reverseStringReversedLongString.json'))
	})
	*/
});
