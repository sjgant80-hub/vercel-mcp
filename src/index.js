#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const TOOLS = [
  {
    "name": "readAccessGroup",
    "description": "GET /v1/access-groups/{idOrName} · Reads an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idOrName": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateAccessGroup",
    "description": "POST /v1/access-groups/{idOrName} · Update an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idOrName": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteAccessGroup",
    "description": "DELETE /v1/access-groups/{idOrName} · Deletes an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idOrName": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listAccessGroupMembers",
    "description": "GET /v1/access-groups/{idOrName}/members · List members of an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idOrName": {
          "type": "string"
        },
        "limit": {
          "type": "string"
        },
        "next": {
          "type": "string"
        },
        "search": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listAccessGroups",
    "description": "GET /v1/access-groups · List access groups for a team, project or member",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "search": {
          "type": "string"
        },
        "membersLimit": {
          "type": "string"
        },
        "projectsLimit": {
          "type": "string"
        },
        "limit": {
          "type": "string"
        },
        "next": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createAccessGroup",
    "description": "POST /v1/access-groups · Creates an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listAccessGroupProjects",
    "description": "GET /v1/access-groups/{idOrName}/projects · List projects of an access group",
    "inputSchema": {
      "type": "object",
      "properties": {
        "idOrName": {
          "type": "string"
        },
        "limit": {
          "type": "string"
        },
        "next": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createAccessGroupProject",
    "description": "POST /v1/access-groups/{accessGroupIdOrName}/projects · Create an access group project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accessGroupIdOrName": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "readAccessGroupProject",
    "description": "GET /v1/access-groups/{accessGroupIdOrName}/projects/{projectId} · Reads an access group project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accessGroupIdOrName": {
          "type": "string"
        },
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateAccessGroupProject",
    "description": "PATCH /v1/access-groups/{accessGroupIdOrName}/projects/{projectId} · Update an access group project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accessGroupIdOrName": {
          "type": "string"
        },
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteAccessGroupProject",
    "description": "DELETE /v1/access-groups/{accessGroupIdOrName}/projects/{projectId} · Delete an access group project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accessGroupIdOrName": {
          "type": "string"
        },
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "recordEvents",
    "description": "POST /v8/artifacts/events · Record an artifacts cache usage event",
    "inputSchema": {
      "type": "object",
      "properties": {
        "'x-Artifact-Client-Ci'": {
          "type": "string"
        },
        "'x-Artifact-Client-Interactive'": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "status",
    "description": "GET /v8/artifacts/status · Get status of Remote Caching for this principal",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "downloadArtifact",
    "description": "GET /v8/artifacts/{hash} · Download a cache artifact",
    "inputSchema": {
      "type": "object",
      "properties": {
        "'x-Artifact-Client-Ci'": {
          "type": "string"
        },
        "'x-Artifact-Client-Interactive'": {
          "type": "string"
        },
        "hash": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "uploadArtifact",
    "description": "PUT /v8/artifacts/{hash} · Upload a cache artifact",
    "inputSchema": {
      "type": "object",
      "properties": {
        "'content-Length'": {
          "type": "string"
        },
        "'x-Artifact-Duration'": {
          "type": "string"
        },
        "'x-Artifact-Client-Ci'": {
          "type": "string"
        },
        "'x-Artifact-Client-Interactive'": {
          "type": "string"
        },
        "'x-Artifact-Tag'": {
          "type": "string"
        },
        "'x-Artifact-Sha'": {
          "type": "string"
        },
        "'x-Artifact-Dirty-Hash'": {
          "type": "string"
        },
        "hash": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "artifactQuery",
    "description": "POST /v8/artifacts · Query information about an artifact",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteAllArtifacts",
    "description": "DELETE /v8/artifacts · Delete all cache artifacts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listBillingCharges",
    "description": "GET /v1/billing/charges · List FOCUS billing charges",
    "inputSchema": {
      "type": "object",
      "properties": {
        "from": {
          "type": "string"
        },
        "to": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listContractCommitments",
    "description": "GET /v1/billing/contract-commitments · List FOCUS contract commitments",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "buyCredits",
    "description": "POST /v1/billing/buy · Purchase credits",
    "inputSchema": {
      "type": "object",
      "properties": {
        "source": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getRedirects",
    "description": "GET /v1/bulk-redirects · Gets project-level redirects.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "versionId": {
          "type": "string"
        },
        "q": {
          "type": "string"
        },
        "diff": {
          "type": "string"
        },
        "page": {
          "type": "string"
        },
        "per_page": {
          "type": "string"
        },
        "sort_by": {
          "type": "string"
        },
        "sort_order": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "stageRedirects",
    "description": "PUT /v1/bulk-redirects · Stages new redirects for a project.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "editRedirect",
    "description": "PATCH /v1/bulk-redirects · Edit a project-level redirect.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteRedirects",
    "description": "DELETE /v1/bulk-redirects · Delete project-level redirects.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "restoreRedirects",
    "description": "POST /v1/bulk-redirects/restore · Restore staged project-level redirects to their production version.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getVersions",
    "description": "GET /v1/bulk-redirects/versions · Get the version history for a project's redirects.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateVersion",
    "description": "POST /v1/bulk-redirects/versions · Promote a staging version to production or restore a previous production version.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listProjectChecks",
    "description": "GET /v2/projects/{projectIdOrName}/checks · List all checks for a project",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "blocks": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createProjectCheck",
    "description": "POST /v2/projects/{projectIdOrName}/checks · Create a check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getProjectCheck",
    "description": "GET /v2/projects/{projectIdOrName}/checks/{checkId} · Get a check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "checkId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateProjectCheck",
    "description": "PATCH /v2/projects/{projectIdOrName}/checks/{checkId} · Update a check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "checkId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "deleteProjectCheck",
    "description": "DELETE /v2/projects/{projectIdOrName}/checks/{checkId} · Delete a check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "checkId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listCheckRuns",
    "description": "GET /v2/projects/{projectIdOrName}/checks/{checkId}/runs · List runs for a check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "projectIdOrName": {
          "type": "string"
        },
        "checkId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "listDeploymentCheckRuns",
    "description": "GET /v2/deployments/{deploymentId}/check-runs · List check runs for a deployment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createDeploymentCheckRun",
    "description": "POST /v2/deployments/{deploymentId}/check-runs · Create a check run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getDeploymentCheckRun",
    "description": "GET /v2/deployments/{deploymentId}/check-runs/{checkRunId} · Get a check run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "checkRunId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "updateDeploymentCheckRun",
    "description": "PATCH /v2/deployments/{deploymentId}/check-runs/{checkRunId} · Update a check run",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "checkRunId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getAllChecks",
    "description": "GET /v1/deployments/{deploymentId}/checks · Retrieve a list of all checks",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "createCheck",
    "description": "POST /v1/deployments/{deploymentId}/checks · Creates a new Check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  },
  {
    "name": "getCheck",
    "description": "GET /v1/deployments/{deploymentId}/checks/{checkId} · Get a single check",
    "inputSchema": {
      "type": "object",
      "properties": {
        "deploymentId": {
          "type": "string"
        },
        "checkId": {
          "type": "string"
        },
        "teamId": {
          "type": "string"
        },
        "slug": {
          "type": "string"
        }
      }
    }
  }
];
const UPSTREAM = process.env.UPSTREAM || 'https://api.vercel.com';
const APIKEY = process.env.VERCEL_KEY || process.env.API_KEY || '';

const server = new Server({ name: 'vercel-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = TOOLS.find(t => t.name === req.params.name);
  if (!tool) throw new Error('unknown tool');
  const args = req.params.arguments || {};
  const path = tool.description.match(/(GET|POST|PUT|PATCH|DELETE) (\S+)/) || [];
  const method = path[1] || 'GET';
  let url = new URL(path[2] || '/', UPSTREAM);
  for (const [k, v] of Object.entries(args)) if (typeof v === 'string' && url.pathname.includes('{' + k + '}')) url.pathname = url.pathname.replace('{' + k + '}', v);
  const opts = { method, headers: { Authorization: APIKEY ? 'Bearer ' + APIKEY : '' } };
  if (method !== 'GET' && Object.keys(args).length) { opts.body = JSON.stringify(args); opts.headers['Content-Type'] = 'application/json'; }
  const res = await fetch(url, opts);
  const txt = await res.text();
  return { content: [{ type: 'text', text: txt.slice(0, 4000) }] };
});

await server.connect(new StdioServerTransport());
console.error('vercel-mcp v1.0.0 · stdio ready · 40 tools');
