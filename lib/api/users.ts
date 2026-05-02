type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type SignupSuccessResponse = {
  message: string;
  user?: {
    name?: string;
    email?: string;
  };
};

type SignupErrorResponse = {
  error?: string;
};

export async function signupUser(payload: SignupPayload) {
  const response = await fetch("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as SignupSuccessResponse | SignupErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}

type SigninPayload = {
  email: string;
  password: string;
};

type SigninSuccessResponse = {
  token: string;
};

type SigninErrorResponse = {
  error?: string;
};

export async function signinUser(payload: SigninPayload) {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as SigninSuccessResponse | SigninErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}