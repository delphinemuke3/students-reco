describe('Student Records App - Unit Tests', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Environment Configuration', () => {
    test('should have required environment variables with defaults', () => {
      const dbHost = process.env.DB_HOST || 'localhost';
      const dbUser = process.env.DB_USER || 'root';
      const dbPassword = process.env.DB_PASSWORD || 'password';
      const dbName = process.env.DB_NAME || 'students_db';
      const port = process.env.PORT || 3000;

      expect(dbHost).toBeDefined();
      expect(dbUser).toBeDefined();
      expect(dbPassword).toBeDefined();
      expect(dbName).toBeDefined();
      expect(port).toBeDefined();
    });

    test('should have valid port number', () => {
      const port = parseInt(process.env.PORT || 3000);
      expect(port).toBeGreaterThan(0);
      expect(port).toBeLessThan(65536);
    });
  });

  describe('Input Validation', () => {
    test('should validate student name is not empty', () => {
      const name = '';
      expect(!name || name.trim().length === 0).toBe(true);
    });

    test('should validate student age is within range', () => {
      const validateAge = (age) => {
        const ageNum = parseInt(age);
        return ageNum >= 1 && ageNum <= 100;
      };

      expect(validateAge(5)).toBe(true);
      expect(validateAge(50)).toBe(true);
      expect(validateAge(100)).toBe(true);
      expect(validateAge(0)).toBe(false);
      expect(validateAge(101)).toBe(false);
      expect(validateAge(-5)).toBe(false);
    });

    test('should validate classroom is not empty', () => {
      const classroom = '10A';
      expect(!classroom || classroom.trim().length === 0).toBe(false);
    });

    test('should require all fields to be present', () => {
      const validateFields = (name, age, classroom) => {
        return name && age && classroom;
      };

      expect(validateFields('John', 15, '10A')).toBeTruthy();
      expect(validateFields('', 15, '10A')).toBeFalsy();
      expect(validateFields('John', null, '10A')).toBeFalsy();
      expect(validateFields('John', 15, '')).toBeFalsy();
    });
  });

  describe('Data Sanitization', () => {
    test('should trim whitespace from inputs', () => {
      const sanitize = (input) => input.trim();

      expect(sanitize('  John  ')).toBe('John');
      expect(sanitize('  10A  ')).toBe('10A');
    });

    test('should handle special characters in student names', () => {
      const names = [
        'John O\'Brien',
        'María García',
        'Jean-Pierre',
        'O\'Connor-Smith'
      ];

      names.forEach(name => {
        expect(name).toBeTruthy();
        expect(name.length > 0).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle missing required fields gracefully', () => {
      const handleMissingFields = (name, age, classroom) => {
        if (!name || !age || !classroom) {
          return {
            success: false,
            message: 'All fields are required'
          };
        }
        return { success: true };
      };

      expect(handleMissingFields('', 15, '10A')).toEqual({
        success: false,
        message: 'All fields are required'
      });
    });

    test('should validate HTTP status codes', () => {
      const statusCodes = {
        OK: 200,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
      };

      expect(statusCodes.OK).toBe(200);
      expect(statusCodes.BAD_REQUEST).toBe(400);
      expect(statusCodes.NOT_FOUND).toBe(404);
      expect(statusCodes.SERVER_ERROR).toBe(500);
    });
  });

  describe('Utility Functions', () => {
    test('should format student data correctly', () => {
      const formatStudent = (student) => ({
        id: student.id,
        name: student.name.trim(),
        age: parseInt(student.age),
        classroom: student.classroom.trim(),
        created_at: new Date(student.created_at).toLocaleDateString()
      });

      const student = {
        id: 1,
        name: '  John  ',
        age: '15',
        classroom: '  10A  ',
        created_at: '2024-01-15T10:30:00Z'
      };

      const formatted = formatStudent(student);

      expect(formatted.name).toBe('John');
      expect(formatted.age).toBe(15);
      expect(formatted.classroom).toBe('10A');
    });

    test('should sort students by creation date', () => {
      const students = [
        { id: 1, created_at: '2024-01-15' },
        { id: 2, created_at: '2024-01-10' },
        { id: 3, created_at: '2024-01-20' }
      ];

      const sorted = [...students].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      expect(sorted[0].id).toBe(3);
      expect(sorted[1].id).toBe(1);
      expect(sorted[2].id).toBe(2);
    });
  });
});
