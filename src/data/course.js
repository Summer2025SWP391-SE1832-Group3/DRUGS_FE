const courses = [
    {
        id: 1,
        title: 'Course 1',
        description: 'Basic introduction to fundamental concepts',
        image: 'https://picsum.photos/300/200?random=1',
        createdBy: 'John Smith',
        createdAt: '2024-01-15T08:30:00Z',
        lessons: [
            {
                title: 'Introduction to Course 1',
                content: 'Đây là kiến thức trọng tâm của bài học 1. Bạn sẽ hiểu về khái niệm cơ bản và nền tảng của chủ đề.',
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                questions: [
                    {
                        question: 'What is the main topic of Course 1?',
                        choices: ['Basics', 'Advanced', 'Professional', 'None'],
                        answer: 0
                    },
                    {
                        question: 'Who is the instructor?',
                        choices: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis'],
                        answer: 0
                    }
                ]
            },
            {
                title: 'Fundamental Concepts',
                content: 'Bài học này giúp bạn nắm vững các khái niệm nền tảng và ứng dụng thực tiễn.',
                videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
                questions: [
                    {
                        question: 'What is a fundamental concept?',
                        choices: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Course 2',
        description: 'Developing core skills and knowledge',
        image: 'https://picsum.photos/300/200?random=2',
        createdBy: 'Sarah Johnson',
        createdAt: '2024-01-16T10:15:00Z',
        lessons: [
            {
                title: 'Core Skills Overview',
                content: 'Tổng quan về các kỹ năng cốt lõi cần thiết cho chủ đề này.',
                videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
                questions: [
                    {
                        question: 'What is a core skill?',
                        choices: ['Skill A', 'Skill B', 'Skill C', 'Skill D'],
                        answer: 2
                    }
                ]
            },
            {
                title: 'Knowledge Development',
                content: 'Phát triển kiến thức thông qua thực hành và lý thuyết.',
                videoUrl: 'https://www.youtube.com/embed/L_jWHffIx5E',
                questions: [
                    {
                        question: 'How do you develop knowledge?',
                        choices: ['Practice', 'Theory', 'Both', 'None'],
                        answer: 2
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'Course 3',
        description: 'Intermediate level concepts and applications',
        image: 'https://picsum.photos/300/200?random=3',
        createdBy: 'Michael Brown',
        createdAt: '2024-01-17T14:45:00Z',
        lessons: [
            {
                title: 'Intermediate Concepts',
                content: 'Các khái niệm trung cấp và ứng dụng nâng cao.',
                videoUrl: 'https://www.youtube.com/embed/tVj0ZTS4WF4',
                questions: [
                    {
                        question: 'What is an intermediate concept?',
                        choices: ['Concept X', 'Concept Y', 'Concept Z', 'Concept W'],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'Course 4',
        description: 'Advanced topics and practical exercises',
        image: 'https://picsum.photos/300/200?random=4',
        createdBy: 'Emily Davis',
        createdAt: '2024-01-18T09:20:00Z',
        lessons: [
            {
                title: 'Advanced Topics',
                content: 'Chủ đề nâng cao và các bài tập thực hành chuyên sâu.',
                videoUrl: 'https://www.youtube.com/embed/ZZ5LpwO-An4',
                questions: [
                    {
                        question: 'What is an advanced topic?',
                        choices: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
                        answer: 0
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: 'Course 5',
        description: 'Specialized training and professional development',
        image: 'https://picsum.photos/300/200?random=5',
        createdBy: 'David Wilson',
        createdAt: '2024-01-19T11:30:00Z',
        lessons: [
            {
                title: 'Specialized Training',
                content: 'Đào tạo chuyên sâu và phát triển nghề nghiệp.',
                videoUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0',
                questions: [
                    {
                        question: 'What is specialized training?',
                        choices: ['Training A', 'Training B', 'Training C', 'Training D'],
                        answer: 3
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        title: 'Course 6',
        description: 'Career-focused learning and skill enhancement',
        image: 'https://picsum.photos/300/200?random=6',
        createdBy: 'Lisa Anderson',
        createdAt: '2024-01-20T13:45:00Z',
        lessons: [
            {
                title: 'Career Learning',
                content: 'Học tập hướng nghiệp và nâng cao kỹ năng.',
                videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
                questions: [
                    {
                        question: 'What is career-focused learning?',
                        choices: ['Learning A', 'Learning B', 'Learning C', 'Learning D'],
                        answer: 1
                    }
                ]
            }
        ]
    },
    {
        id: 7,
        title: 'Course 7',
        description: 'Professional advancement and leadership skills',
        image: 'https://picsum.photos/300/200?random=7',
        createdBy: 'Robert Taylor',
        createdAt: '2024-01-21T15:15:00Z',
        lessons: [
            {
                title: 'Leadership Skills',
                content: 'Kỹ năng lãnh đạo và phát triển bản thân.',
                videoUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
                questions: [
                    {
                        question: 'What is a leadership skill?',
                        choices: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
                        answer: 2
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        title: 'Course 8',
        description: 'Expert-level mastery and specialized knowledge',
        image: 'https://picsum.photos/300/200?random=8',
        createdBy: 'Jennifer Martinez',
        createdAt: '2024-01-22T16:30:00Z',
        lessons: [
            {
                title: 'Expert Mastery',
                content: 'Nội dung bài học :Làm chủ kiến thức chuyên sâu và kỹ năng đặc biệt.',
                videoUrl: 'https://www.youtube.com/embed/60ItHLz5WEA',
                questions: [
                    {
                        question: 'What is expert-level mastery?',
                        choices: ['Mastery A', 'Mastery B', 'Mastery C', 'Mastery D'],
                        answer: 0
                    }
                ]
            }
        ]
    },
]
export default courses;