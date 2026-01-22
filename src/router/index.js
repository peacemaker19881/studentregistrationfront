import { createRouter, createWebHistory } from "vue-router";
import LoginComponent from "@/components/LoginComponent.vue";
import StudentForm from "@/components/StudentForm.vue";
import AboutUsComponent from "@/components/AboutUsComponent.vue";
import HomeComponent from "@/components/HomeComponent.vue";
import AdminNewsComponent from "@/components/AdminNewsComponent.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeComponent,
  },
    {
    path: "/Login",
    name: "Login",
    component: LoginComponent,
  },
      {
    path: "/Admin",
    name: "Admin",
    component: AdminNewsComponent,
  },
  {
    path: "/student",
    name: "Student",
    component: StudentForm,
  },
   {
    path: "/Aboutus",
    name: "AboutUs",
    component: AboutUsComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
