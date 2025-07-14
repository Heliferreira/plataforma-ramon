import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickActions = ({ actions }) => {
  return (
    <Card className="glassmorphism">
      <CardContent className="pt-6 space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button variant="outline" className="w-full justify-start py-6 text-base" asChild>
              <Link to={action.link}>
                {React.cloneElement(action.icon, { className: `${action.icon.props.className} text-primary`})}
                <span className="ml-2 text-foreground">{action.label}</span>
              </Link>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;