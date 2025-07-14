import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const RecentActivitiesList = ({ activities }) => {
  return (
    <Card className="glassmorphism">
      <CardContent className="pt-6 space-y-4">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-3 p-3 hover:bg-secondary/30 rounded-md transition-colors"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                {React.cloneElement(activity.icon, { className: `${activity.icon.props.className} text-primary`})}
              </div>
              <div>
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesList;