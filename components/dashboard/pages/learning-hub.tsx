"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Play,
  BookOpen,
  Award,
  Clock,
  Star,
  Users,
  Filter,
  Download,
  ExternalLink,
  CheckCircle,
  PlayCircle,
  FileText,
  Video,
  Headphones
} from "lucide-react";

export function LearningHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const courses = [
    {
      id: 1,
      title: "Complete React Developer Course",
      instructor: "Sarah Johnson",
      category: "Web Development",
      level: "Intermediate",
      duration: "12 hours",
      rating: 4.8,
      students: 1250,
      price: "Free",
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      description: "Master React from basics to advanced concepts including hooks, context, and state management.",
      progress: 65,
      isEnrolled: true,
      skills: ["React", "JavaScript", "Hooks", "State Management"]
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Dr. Michael Chen",
      category: "Data Science",
      level: "Beginner",
      duration: "8 hours",
      rating: 4.9,
      students: 890,
      price: "Free",
      thumbnail: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      description: "Learn the fundamentals of data science including statistics, Python, and data visualization.",
      progress: 0,
      isEnrolled: false,
      skills: ["Python", "Statistics", "Data Analysis", "Visualization"]
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      instructor: "Emily Rodriguez",
      category: "Design",
      level: "Beginner",
      duration: "6 hours",
      rating: 4.7,
      students: 567,
      price: "Free",
      thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      description: "Master the principles of user interface and user experience design.",
      progress: 30,
      isEnrolled: true,
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      instructor: "Prof. David Kim",
      category: "AI/ML",
      level: "Intermediate",
      duration: "15 hours",
      rating: 4.6,
      students: 723,
      price: "Free",
      thumbnail: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      description: "Introduction to machine learning algorithms and their practical applications.",
      progress: 0,
      isEnrolled: false,
      skills: ["Python", "TensorFlow", "Algorithms", "Neural Networks"]
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      instructor: "Lisa Wang",
      category: "Marketing",
      level: "Beginner",
      duration: "10 hours",
      rating: 4.5,
      students: 445,
      price: "Free",
      thumbnail: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2",
      description: "Learn effective digital marketing strategies for modern businesses.",
      progress: 0,
      isEnrolled: false,
      skills: ["SEO", "Social Media", "Analytics", "Content Marketing"]
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Resume Templates Collection",
      type: "Template",
      category: "Career",
      downloads: 1250,
      rating: 4.8,
      description: "Professional resume templates for various industries and experience levels."
    },
    {
      id: 2,
      title: "Interview Preparation Guide",
      type: "PDF",
      category: "Career",
      downloads: 890,
      rating: 4.9,
      description: "Comprehensive guide with common interview questions and best practices."
    },
    {
      id: 3,
      title: "Coding Challenge Solutions",
      type: "Code",
      category: "Programming",
      downloads: 567,
      rating: 4.7,
      description: "Solutions to popular coding interview questions with explanations."
    },
    {
      id: 4,
      title: "Portfolio Website Templates",
      type: "Template",
      category: "Design",
      downloads: 723,
      rating: 4.6,
      description: "Modern portfolio website templates for showcasing your work."
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "React Developer",
      description: "Completed React Developer Course",
      icon: "🏆",
      earned: true,
      date: "March 2024"
    },
    {
      id: 2,
      title: "First Course",
      description: "Enrolled in your first course",
      icon: "🎯",
      earned: true,
      date: "February 2024"
    },
    {
      id: 3,
      title: "Quick Learner",
      description: "Complete 3 courses in a month",
      icon: "⚡",
      earned: false,
      progress: 33
    },
    {
      id: 4,
      title: "Knowledge Seeker",
      description: "Complete 10 courses",
      icon: "📚",
      earned: false,
      progress: 20
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const enrolledCourses = courses.filter(course => course.isEnrolled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
        <p className="text-gray-600 mt-2">Enhance your skills with curated courses and resources</p>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">All Courses</TabsTrigger>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses, instructors, or topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-t-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                      <Play className="mr-2 h-5 w-5" />
                      Preview
                    </Button>
                  </div>
                  <Badge className="absolute top-3 left-3 bg-green-600">{course.price}</Badge>
                  <Badge variant="secondary" className="absolute top-3 right-3">{course.level}</Badge>
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{course.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students}
                    </div>
                  </div>

                  {course.isEnrolled && course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={course.isEnrolled ? "secondary" : "default"}
                  >
                    {course.isEnrolled ? (
                      <>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Enroll Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-learning" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                        <div className="flex justify-between text-sm mt-2">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2 mt-1" />
                      </div>
                      <Button>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <p className="text-sm text-gray-600">Courses Enrolled</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">18</div>
                  <p className="text-sm text-gray-600">Hours Learned</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">2</div>
                  <p className="text-sm text-gray-600">Certificates Earned</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {resource.type === 'PDF' && <FileText className="h-6 w-6 text-blue-600" />}
                        {resource.type === 'Template' && <Download className="h-6 w-6 text-blue-600" />}
                
                        {resource.type === 'Video' && <Video className="h-6 w-6 text-blue-600" />}
                        {resource.type === 'Code' && <BookOpen className="h-6 w-6 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{resource.title}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{resource.category}</Badge>
                      </div>
                    </div>
                    <Badge variant="secondary">{resource.type}</Badge>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>
                    <Button size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                      
                      {achievement.earned ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            Earned {achievement.date}
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}