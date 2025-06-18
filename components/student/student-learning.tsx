"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Star,
  Award,
  Target,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export function StudentLearning() {
  const learningPaths = [
    {
      id: 1,
      title: "Full-Stack Web Development",
      description:
        "Master modern web development with React, Node.js, and databases",
      progress: 65,
      totalCourses: 12,
      completedCourses: 8,
      estimatedTime: "6 weeks",
      difficulty: "Intermediate",
      skills: ["React", "Node.js", "MongoDB", "Express"],
      enrolled: true,
      featured: true,
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description:
        "Learn Python, statistics, and machine learning for data analysis",
      progress: 30,
      totalCourses: 10,
      completedCourses: 3,
      estimatedTime: "8 weeks",
      difficulty: "Beginner",
      skills: ["Python", "Pandas", "NumPy", "Scikit-learn"],
      enrolled: true,
      featured: false,
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "Build native mobile apps for iOS and Android platforms",
      progress: 0,
      totalCourses: 15,
      completedCourses: 0,
      estimatedTime: "10 weeks",
      difficulty: "Advanced",
      skills: ["React Native", "Swift", "Kotlin", "Firebase"],
      enrolled: false,
      featured: true,
    },
  ];

  const currentCourses = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Sarah Chen",
      progress: 75,
      nextLesson: "Higher-Order Components",
      timeRemaining: "2 hours",
      dueDate: "Tomorrow",
    },
    {
      id: 2,
      title: "Database Design & SQL",
      instructor: "Michael Rodriguez",
      progress: 45,
      nextLesson: "Normalization Techniques",
      timeRemaining: "1.5 hours",
      dueDate: "This Friday",
    },
    {
      id: 3,
      title: "Python for Data Analysis",
      instructor: "Dr. Emily Watson",
      progress: 20,
      nextLesson: "Pandas DataFrames",
      timeRemaining: "3 hours",
      dueDate: "Next Monday",
    },
  ];

  const achievements = [
    {
      title: "JavaScript Master",
      description: "Completed 10 JavaScript courses",
      icon: Award,
      earned: true,
      date: "2 weeks ago",
    },
    {
      title: "Quick Learner",
      description: "Finished 3 courses in one week",
      icon: TrendingUp,
      earned: true,
      date: "1 month ago",
    },
    {
      title: "Team Player",
      description: "Participated in 5 group projects",
      icon: Users,
      earned: false,
      progress: 60,
    },
    {
      title: "Consistent Learner",
      description: "Study streak of 30 days",
      icon: Calendar,
      earned: false,
      progress: 80,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Path</h1>
          <p className="text-muted-foreground">
            Develop your skills with personalized learning recommendations
          </p>
        </div>
        <Button>
          <BookOpen className="w-4 h-4 mr-2" />
          Browse Courses
        </Button>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Courses Enrolled
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Courses Completed
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Learning Hours
                </p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Achievements
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Continue Learning
              </CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructor}
                      </p>
                    </div>
                    <Badge variant="outline">{course.dueDate}</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Next: {course.nextLesson}</p>
                      <p>{course.timeRemaining} remaining</p>
                    </div>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Continue
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recommended Learning Paths
              </CardTitle>
              <CardDescription>
                Structured courses to achieve your career goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {learningPaths.map((path) => (
                <div
                  key={path.id}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${path.featured ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{path.title}</h3>
                        {path.featured && (
                          <Badge variant="secondary">Recommended</Badge>
                        )}
                        {path.enrolled && (
                          <Badge className="bg-green-100 text-green-700">
                            Enrolled
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {path.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{path.totalCourses} courses</span>
                        <span>{path.estimatedTime}</span>
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {path.enrolled && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>
                          {path.completedCourses}/{path.totalCourses} courses
                          completed
                        </span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {path.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={path.enrolled}
                    >
                      {path.enrolled ? "Enrolled" : "Enroll Now"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Study Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">24</div>
                <p className="text-sm text-muted-foreground">Days in a row</p>
                <div className="flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < 6 ? "bg-primary" : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achievements</CardTitle>
              <CardDescription>Your learning milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${achievement.earned ? "bg-emerald-50" : "bg-gray-50"}`}
                >
                  <div
                    className={`p-2 rounded-lg ${achievement.earned ? "bg-emerald-100" : "bg-gray-200"}`}
                  >
                    <achievement.icon
                      className={`w-4 h-4 ${achievement.earned ? "text-emerald-600" : "text-gray-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <p className="text-xs text-emerald-600 mt-1">
                        Earned {achievement.date}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <Progress
                          value={achievement.progress}
                          className="h-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.progress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skill Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skill Recommendations</CardTitle>
              <CardDescription>Based on your career goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">TypeScript</span>
                <Badge variant="outline">High Demand</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Docker</span>
                <Badge variant="outline">Growing</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AWS</span>
                <Badge variant="outline">Essential</Badge>
              </div>
              <Button size="sm" variant="outline" className="w-full">
                View All Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
