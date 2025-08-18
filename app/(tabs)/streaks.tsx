import { COMPLETIONS_COLLECTION_ID, DATABASE_ID, HABITS_COLLECTION_ID, databases } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, HabitCompletion } from '@/types/database.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Card, Text } from "react-native-paper";

export default function StreaksScreen(){
    const {user} = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);

    useEffect(() => {
        if (user){
          fetchHabits();
          fetchCompletions();
        }
      }, [user])

      const fetchHabits = async () => {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID, 
            HABITS_COLLECTION_ID,
            [Query.equal("user_id", user?.$id ?? "")]
          );
          console.log(response.documents);
          setHabits(response.documents as unknown as Habit[]);
        } catch (error) {
          console.error(error)
        }
      }
    
      const fetchCompletions = async () => {
        try {
          const response = await databases.listDocuments(
            DATABASE_ID, 
            COMPLETIONS_COLLECTION_ID,
            [
              Query.equal("user_id", user?.$id ?? ""), 
            ]
          );
          const completions = response.documents as unknown as HabitCompletion[]
          setCompletedHabits(completions);
        } catch (error) {
          console.error(error)
        }
      };

      interface StreakData {
        streak: number;
        bestStreak: number;
        total: number
      }

      const getStreakData = (habitId: string): StreakData => {
        const habitCompletions = completedHabits
          ?.filter((c) => c.habit_id === habitId)
          .sort(
            (a, b) => 
              new Date(a.completed_at).getTime()
             - new Date(b.completed_at).getTime()
            );

        if (habitCompletions?.length === 0){
            return {streak: 0, bestStreak: 0, total: 0}
        }

        // build streak data
        let streak = 0;
        let bestStreak = 0;
        let total = habitCompletions.length;

        let lastDate: Date | null = null;
        let currentStreak = 0;

        habitCompletions?.forEach((c) => {
            const date = new Date(c.completed_at)
            if (lastDate){
                const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)

                if (diff <= 1.5){
                    currentStreak += 1
                } else {
                    currentStreak = 1
                }
            } else {
              currentStreak = 1
              }
            
            if (currentStreak > bestStreak) bestStreak = currentStreak;
            streak = currentStreak
            lastDate = date
            
        });

        return {streak, bestStreak, total}
      }

      const habitStreaks = habits.map((habit) => {
        const {streak, bestStreak, total} = getStreakData(habit.$id);
        return {habit, bestStreak, streak, total}
      })

      const rankedHabits = habitStreaks.sort((a, b) => a.bestStreak - b.bestStreak)

      console.log(rankedHabits.map((h) => h.habit.title))
    
      return (
        <View style={styles.container}>
            <Text style={styles.title}>Habit Streaks</Text>

            {habits.length === 0 ? (
                <View>
                    <Text>There are no habits yet, add your first habbit!</Text>
                </View>
            ): (
                rankedHabits.map(({habit, streak, bestStreak, total}, key) => (
                    <Card key={key} style={[styles.card, key === 0 && styles.firstCard]}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.habitTitle}>{habit.title}</Text>
                            <Text style={styles.habitDescription}>{habit.description}</Text>
                            <View style={styles.statsRow}>
                                <View style={styles.statBadge}>
                                  <View style={styles.badgeIconTextContainer}>
                                    <MaterialCommunityIcons 
                                          name="fire" 
                                          size={18} 
                                          color={"#ff9800"}
                                      />
                                    <Text style={styles.statBadgeText}>{streak}</Text>
                                  </View>
                                    <Text style={styles.statBadgeLabel}>Current</Text>
                                </View>
                                <View style={styles.statBadgeGold}>
                                  <View style={styles.badgeIconTextContainer}>
                                    <MaterialCommunityIcons 
                                              name="trophy" 
                                              size={18} 
                                              color={"gold"}
                                          />
                                    <Text style={styles.statBadgeText}>{bestStreak}</Text>
                                  </View>
                                    
                                    <Text style={styles.statBadgeLabel}>best</Text>
                                </View>
                                <View style={styles.statBadgeGreen}>
                                  <View style={styles.badgeIconTextContainer}>
                                    <MaterialCommunityIcons 
                                              name="check-circle" 
                                              size={18} 
                                              color={"green"}
                                          />
                                    <Text style={styles.statBadgeText}>{total}</Text>
                                  </View>
                                    <Text style={styles.statBadgeLabel}> Total</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                ))
            )}
        </View>
      )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0zxz  23c4v"
  },
  firstCard: {
    borderWidth: 2,
    borderColor: "#7c4dff"
  },
  habitTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 2
  },
  habitDescription: {
    color: "#6c6c80",
    marginBottom: 8
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 8
  },
  badgeIconTextContainer: {
    flexDirection: "row",
  },
  statBadge: {
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60
  },
  statBadgeGold: {
    backgroundColor: "#fffde7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60
  },
  statBadgeGreen: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 60
  },
  statBadgeText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#22223b",
    marginLeft: 8
  },
  statBadgeLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    fontWeight: "500"
  },
})