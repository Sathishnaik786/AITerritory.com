import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bookmark, 
  Heart, 
  Share2, 
  Settings, 
  LogOut, 
  Star,
  ExternalLink,
  Calendar,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { bookmarkService } from '../services/bookmarkService';
import { Tool } from '../types/tool';
import { LikesService } from '../services/likesService';
import { SharesService } from '../services/sharesService';
import { getReviewsForUser } from '../services/reviewsService';

const UserDashboardPage: React.FC = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Tool[]>([]);
  const [likes, setLikes] = useState<any[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const [userBookmarks, userLikes, userShares, userReviews] = await Promise.all([
            bookmarkService.getBookmarksForUser(user.id),
            LikesService.getLikesForUser(user.id),
            SharesService.getSharesForUser(user.id),
            getReviewsForUser(user.id),
          ]);
          setBookmarks(userBookmarks || []);
          setLikes(userLikes || []);
          setShares(userShares || []);
          setReviews(userReviews || []);
        } catch (error) {
          setLikes([]);
          setShares([]);
          setReviews([]);
          console.error('Error fetching user dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h2>
          <Button onClick={() => window.Clerk?.openSignIn?.() || window.location.reload()}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.firstName || user.username || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account, bookmarks, and preferences
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bookmark className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{bookmarks.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Bookmarks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{likes.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Share2 className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{shares.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Shares</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Bookmarks
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Likes
              </TabsTrigger>
              <TabsTrigger value="shares" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Shares
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{user.emailAddresses[0]?.emailAddress}</p>
                      <Badge variant="secondary" className="mt-1">
                        Member since {new Date(user.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookmarks</CardTitle>
                  <CardDescription>
                    Tools you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading bookmarks...</p>
                    </div>
                  ) : bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bookmarks.map((tool) => (
                        <Card key={tool.id || tool.link} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <img
                                src={tool.image_url || tool.image || '/placeholder.svg'}
                                alt={tool.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate">{tool.name}</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {tool.description}
                                </p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => window.open(tool.link, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Visit
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                      <p className="text-gray-600 mb-4">
                        Start exploring AI tools and bookmark your favorites
                      </p>
                      <Button onClick={() => navigate('/resources/all-resources')}>
                        Explore Tools
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Likes Tab */}
            <TabsContent value="likes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Likes</CardTitle>
                  <CardDescription>Tools you've liked</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading likes...</p>
                    </div>
                  ) : likes.length > 0 ? (
                    <ul className="space-y-4">
                      {likes.map((like) => (
                        <li key={like.id || like.tool_id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <span className="font-semibold">Tool ID:</span> {like.tool_id}
                            {/* To show tool name/image, fetch tool details by tool_id here */}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 md:mt-0">Liked on {new Date(like.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No likes yet</h3>
                      <p className="text-gray-600 mb-4">Like some tools to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shares Tab */}
            <TabsContent value="shares" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Shares</CardTitle>
                  <CardDescription>Tools you've shared</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading shares...</p>
                    </div>
                  ) : shares.length > 0 ? (
                    <ul className="space-y-4">
                      {shares.map((share) => (
                        <li key={share.id || share.tool_id + share.platform + share.created_at} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <span className="font-semibold">Tool ID:</span> {share.tool_id}
                            {share.tool_name && <span className="ml-2">({share.tool_name})</span>}
                            {share.platform && <span className="ml-2 text-xs text-gray-500">[{share.platform}]</span>}
                            {/* To show tool name/image, fetch tool details by tool_id here */}
                          </div>
                          <div className="text-xs text-gray-500 mt-2 md:mt-0">Shared on {new Date(share.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Share2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No shares yet</h3>
                      <p className="text-gray-600 mb-4">Share some tools to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Reviews</CardTitle>
                  <CardDescription>Reviews you've written</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading reviews...</p>
                    </div>
                  ) : reviews.length > 0 ? (
                    <ul className="space-y-4">
                      {reviews.map((review) => (
                        <li key={review.id || review.tool_id + review.created_at} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <span className="font-semibold">Tool ID:</span> {review.tool_id}
                            {/* To show tool name/image, fetch tool details by tool_id here */}
                            <div className="mt-1">
                              <span className="font-semibold">Rating:</span> {review.rating} / 5
                            </div>
                            <div className="mt-1">
                              <span className="font-semibold">Comment:</span> {review.comment}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 md:mt-0">Reviewed on {new Date(review.created_at).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                      <p className="text-gray-600 mb-4">Write a review to see it here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent interactions and contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No recent activity</h3>
                    <p className="text-gray-600">
                      Start liking, sharing, and reviewing tools to see your activity here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates about new tools and features</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="font-medium">Privacy Settings</h4>
                        <p className="text-sm text-gray-600">Manage your privacy and data preferences</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboardPage; 