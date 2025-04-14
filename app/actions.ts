import { supabase } from "@/lib/supabase";

export async function createGameSession(sessionData: {
  session_id: string;
  game_id: string;
  session_start: string;
}) {
  try {
    const { data, error } = await supabase
      .from('smith_game_logs')
      .insert({
        session_id: sessionData.session_id,
        game_id: sessionData.game_id,
        session_start: sessionData.session_start
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating game session:', error);
    return { data: null, error };
  }
}

export async function updateGameSession(sessionData: {
  session_id: string;
  score: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session_log: any[];
  session_end: string;
}) {
  try {
    const { data, error } = await supabase
      .from('smith_game_logs')
      .update({
        score: sessionData.score,
        session_log: sessionData.session_log,
        session_end: sessionData.session_end
      })
      .eq('session_id', sessionData.session_id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating game session:', error);
    return { data: null, error };
  }
} 