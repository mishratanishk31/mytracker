import { supabase } from './supabase-config.js';

const authScreen = document.getElementById('authScreen');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authHeading = document.getElementById('authHeading');
const authMessage = document.getElementById('authMessage');
const authSubmit = document.getElementById('authSubmit');
const authToggle = document.getElementById('authToggle');
const authToggleText = document.getElementById('authToggleText');
const authStatus = document.getElementById('authStatus');
const googleLogin = document.getElementById('googleLogin');
const forgotPassword = document.getElementById('forgotPassword');
const logoutBtn = document.getElementById('logoutBtn');
let isSignUp = false;

function showStatus(message) {
  authStatus.textContent = message;
}

function setAuthMode(signup) {
  isSignUp = signup;

  authHeading.textContent = signup ? 'Create Account' : 'Welcome Back';
  authMessage.textContent = signup
    ? 'Create your MyTracker account.'
    : 'Sign in to access your expenses.';

  authSubmit.textContent = signup ? 'Create Account' : 'Sign In';

  authToggleText.firstChild.textContent = signup
    ? 'Already have an account? '
    : "Don't have an account? ";

  authToggle.textContent = signup ? 'Sign In' : 'Create Account';
  authPassword.autocomplete = signup ? 'new-password' : 'current-password';

  showStatus('');
}

authToggle.addEventListener('click', () => {
  setAuthMode(!isSignUp);
});
googleLogin.addEventListener('click', async () => {
  showStatus('Connecting to Google...');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    showStatus(error.message);
  }
});
forgotPassword.addEventListener('click', async () => {
  const email = authEmail.value.trim();

  if (!email) {
    showStatus('Please enter your email address first.');
    authEmail.focus();
    return;
  }

  showStatus('Sending password reset email...');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    showStatus(error.message);
  } else {
    showStatus('Password reset link sent. Check your email.');
  }
});
logoutBtn.addEventListener('click', async () => {
  showStatus('Signing out...');

  const { error } = await supabase.auth.signOut();

  if (error) {
    showStatus(error.message);
  }
});
authForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = authEmail.value.trim();
  const password = authPassword.value;

  authSubmit.disabled = true;
  showStatus('Please wait...');

  try {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      showStatus(
        data.session
          ? 'Account created successfully!'
          : 'Check your email to confirm your account.'
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showStatus('Login successful!');
    }
  } catch (error) {
    console.error('MyTracker Auth Error:', error);
    showStatus(error.message);
  } finally {
    authSubmit.disabled = false;
  }
});

async function updateAuthScreen(session) {
  authScreen.style.display = session ? 'none' : 'flex';
  document.querySelector('.wrap').style.display = session ? '' : 'none';
  document.getElementById('aiWidget').style.display =
    session ? '' : 'none';
}

supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthScreen(session);
});

const { data, error } = await supabase.auth.getSession();

if (error) {
  showStatus(error.message);
} else {
  await updateAuthScreen(data.session);
}

setAuthMode(false);