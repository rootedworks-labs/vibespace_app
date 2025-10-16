import NotificationList from './_components/NotificationList';

const NotificationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Notifications</h1>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;