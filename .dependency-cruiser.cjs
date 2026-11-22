/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "api-domain-not-depend-on-outer-layers",
      comment:
        "El dominio de la API no puede depender de aplicación, infraestructura ni interfaces.",
      severity: "error",
      from: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/domain",
      },
      to: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/(application|infrastructure|interface)",
      },
    },
    {
      name: "api-application-not-depend-on-infrastructure-or-interface",
      comment: "La aplicación de la API solo puede depender del dominio y de sus puertos.",
      severity: "error",
      from: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/application",
      },
      to: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/(infrastructure|interface)",
      },
    },
    {
      name: "api-infrastructure-not-depend-on-interface",
      comment: "La infraestructura de la API no conoce las interfaces HTTP.",
      severity: "error",
      from: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/infrastructure",
      },
      to: {
        path: "^apps/api/src/modules/(auth|bookings|rooms|contacts|users|offers|stats)/interface",
      },
    },
    {
      name: "admin-domain-not-depend-on-outer-layers",
      comment:
        "El dominio del dashboard no puede depender de aplicación, infraestructura ni presentación.",
      severity: "error",
      from: {
        path: "^apps/admin/src/domain",
      },
      to: {
        path: "^apps/admin/src/(application|infrastructure|presentation)",
      },
    },
    {
      name: "admin-application-not-depend-on-infrastructure-or-presentation",
      comment: "La aplicación del dashboard solo puede depender del dominio y de sus puertos.",
      severity: "error",
      from: {
        path: "^apps/admin/src/application",
      },
      to: {
        path: "^apps/admin/src/(infrastructure|presentation)",
      },
    },
    {
      name: "admin-infrastructure-not-depend-on-presentation",
      comment: "La infraestructura del dashboard no conoce la presentación.",
      severity: "error",
      from: {
        path: "^apps/admin/src/infrastructure",
      },
      to: {
        path: "^apps/admin/src/presentation",
      },
    },
    {
      name: "contract-not-depend-on-apps",
      comment: "El contrato compartido no puede depender de ninguna app.",
      severity: "error",
      from: {
        path: "^packages/contract",
      },
      to: {
        path: "^apps/",
      },
    },
    {
      name: "ui-not-depend-on-api-or-admin",
      comment: "La UI compartida no puede depender de la API ni del dashboard.",
      severity: "error",
      from: {
        path: "^packages/ui",
      },
      to: {
        path: "^apps/(api|admin)",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "(node_modules|dist|build|\\.astro|coverage|generated)",
    },
    tsConfig: {
      fileName: "tsconfig.base.json",
    },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
    },
    reporterOptions: {
      text: {
        highlightFocused: true,
      },
    },
  },
};
