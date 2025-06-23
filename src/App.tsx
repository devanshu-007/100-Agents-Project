import { AppLayout } from './components/AppLayout';
import { ConversationFlow } from './components/ConversationFlow';
import { SafetyReport } from './components/SafetyReport';

function App() {
  return (
    <AppLayout 
      chatPanel={<ConversationFlow />}
      reportPanel={<SafetyReport />}
    />
  );
}

export default App;
